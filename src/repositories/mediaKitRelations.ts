import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "../db/index";
import { mediaKitComments, mediaKitScreens, mediakits, screens } from "../db/schema";

export type MediaKitScreenSelection = {
  screenId: string;
  position?: number;
};

export type MediaKitCommentInput = {
  id?: string;
  authorName?: string | null;
  body: string;
};

const makeId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

/**
 * Normalized persistence boundary for MediaKit inventory and comments.
 * Legacy JSON columns on `mediakits` are intentionally not read or written here.
 */
export const MediaKitRelationsRepository = {
  async findScreens(mediaKitId: string) {
    return db
      .select({
        screenId: mediaKitScreens.screenId,
        position: mediaKitScreens.position,
        createdAt: mediaKitScreens.createdAt,
        screen: screens,
      })
      .from(mediaKitScreens)
      .innerJoin(screens, eq(mediaKitScreens.screenId, screens.id))
      .where(eq(mediaKitScreens.mediaKitId, mediaKitId))
      .orderBy(asc(mediaKitScreens.position), asc(mediaKitScreens.createdAt));
  },

  async replaceScreens(mediaKitId: string, tenantId: string, selections: MediaKitScreenSelection[]) {
    const uniqueSelections = Array.from(
      new Map(selections.map((selection) => [selection.screenId, selection])).values(),
    );

    if (uniqueSelections.length > 0) {
      const ids = uniqueSelections.map((selection) => selection.screenId);
      const ownedScreens = await db
        .select({ id: screens.id })
        .from(screens)
        .where(and(eq(screens.tenantId, tenantId), inArray(screens.id, ids)));

      if (ownedScreens.length !== ids.length) {
        throw new Error("One or more selected screens do not belong to the authenticated tenant.");
      }
    }

    await db.transaction(async (tx) => {
      await tx.delete(mediaKitScreens).where(eq(mediaKitScreens.mediaKitId, mediaKitId));

      if (uniqueSelections.length > 0) {
        await tx.insert(mediaKitScreens).values(
          uniqueSelections.map((selection, index) => ({
            mediaKitId,
            screenId: selection.screenId,
            position: selection.position ?? index,
          })),
        );
      }
    });

    return this.findScreens(mediaKitId);
  },

  async findComments(mediaKitId: string) {
    return db
      .select()
      .from(mediaKitComments)
      .where(eq(mediaKitComments.mediaKitId, mediaKitId))
      .orderBy(asc(mediaKitComments.createdAt));
  },

  async replaceComments(mediaKitId: string, comments: MediaKitCommentInput[]) {
    const normalized = comments
      .filter((comment) => typeof comment.body === "string" && comment.body.trim().length > 0)
      .map((comment) => ({
        id: comment.id || makeId("mkc"),
        mediaKitId,
        authorName: comment.authorName?.trim() || null,
        body: comment.body.trim(),
      }));

    await db.transaction(async (tx) => {
      await tx.delete(mediaKitComments).where(eq(mediaKitComments.mediaKitId, mediaKitId));
      if (normalized.length > 0) {
        await tx.insert(mediaKitComments).values(normalized);
      }
    });

    return this.findComments(mediaKitId);
  },

  async findAggregate(mediaKitId: string, tenantId: string) {
    const [mediaKit] = await db
      .select()
      .from(mediakits)
      .where(and(eq(mediakits.id, mediaKitId), eq(mediakits.tenantId, tenantId)))
      .limit(1);

    if (!mediaKit) return null;

    const [selectedScreens, comments] = await Promise.all([
      this.findScreens(mediaKitId),
      this.findComments(mediaKitId),
    ]);

    return { mediaKit, screens: selectedScreens, comments };
  },
};
