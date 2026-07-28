document.addEventListener('DOMContentLoaded', function() {
      const tocList = document.getElementById('toc-list');
      const mainContent = document.getElementById('main-content');
      const sections = mainContent.querySelectorAll('.content-section[id]');
      
      // Create TOC
      if (tocList && mainContent) {
        const tocElements = mainContent.querySelectorAll('.content-section[id], h2.content-title[id]');

        tocElements.forEach(el => {
            let id, text;
            if (el.tagName === 'SECTION') {
                const titleEl = el.querySelector('.section-title, .content-title');
                if (!titleEl) return;
                id = el.id;
                text = titleEl.textContent;
            } else { // Es un H2
                id = el.id;
                text = el.textContent;
            }
            const li = document.createElement('li');
            li.innerHTML = `<a href="#${id}" class="toc-link">${text}</a>`;
            tocList.appendChild(li);
        });
      }

      // Scrollspy
      const sectionOffsets = Array.from(sections).map(sec => ({ id: sec.id, offset: sec.offsetTop }));

      function updateScrollSpy() {
          const tocLinks = tocList.querySelectorAll('.toc-link');
          let currentSectionId = '';
          sectionOffsets.forEach(sec => {
              if (window.scrollY >= sec.offset - 100) {
                  currentSectionId = sec.id;
              }
          });
          tocLinks.forEach(link => {
              link.classList.remove('is-active');
              if (link.getAttribute('href') === `#${currentSectionId}`) {
                  link.classList.add('is-active');
              }
          });
      }
      window.addEventListener('scroll', updateScrollSpy);
      updateScrollSpy();

      // Mobile Menu Toggle
      const menuToggle = document.getElementById('menu-toggle');
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.getElementById('overlay');

      function closeMenu() {
        sidebar.classList.remove('is-open');
        overlay.classList.remove('is-active');
      }

      if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', () => {
          sidebar.classList.toggle('is-open');
          overlay.classList.toggle('is-active');
        });
        overlay.addEventListener('click', closeMenu);
        tocList.addEventListener('click', (e) => {
          if (e.target.classList.contains('toc-link')) {
            closeMenu();
          }
        });
      }

      // Intersection Observer for animations
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

      // Lógica para mostrar/ocultar campos de hosting
      const hostingRadios = document.querySelectorAll('input[name="hasHosting"]');
      const hostingDetails = document.getElementById('hosting-details');

      function toggleHostingDetails() {
        if (document.getElementById('hosting-yes').checked) {
          hostingDetails.style.display = 'block';
        } else {
          hostingDetails.style.display = 'none';
        }
      }

      hostingRadios.forEach(radio => radio.addEventListener('change', toggleHostingDetails));

      // Lógica para mostrar/ocultar campos de email
      const emailRadios = document.querySelectorAll('input[name="hasEmail"]');
      const emailDetails = document.getElementById('email-details');

      function toggleEmailDetails() {
        if (document.getElementById('email-yes').checked) {
          emailDetails.style.display = 'block';
        } else {
          emailDetails.style.display = 'none';
        }
      }
      emailRadios.forEach(radio => radio.addEventListener('change', toggleEmailDetails));

      // Questionnaire Form Logic
      const form = document.getElementById('questionnaire-form');
      if (form) {
          const submitButton = document.getElementById('submit-btn');
          const statusMessage = document.getElementById('form-status');
          const allInputs = form.querySelectorAll('input, textarea, select');
          const ONBOARDING_STORAGE_KEY = 'smartkit-onboarding-progress';

          function validateField(field, showMessage = true) {
              let isValid = true;
              let errorMessage = '';
              const errorContainer = document.getElementById(`${field.id}-error`);

              if (field.required && field.value.trim() === '') {
                  isValid = false;
                  errorMessage = 'Este campo es obligatorio.';
              }

              if (isValid && field.type === 'url' && field.value.trim() !== '') {
                  try {
                      new URL(field.value);
                  } catch (_) {
                      isValid = false;
                      errorMessage = 'Por favor, introduce una URL válida.';
                  }
              }

              if (field.type === 'radio' && field.name && field.required) {
                  const radioGroup = form.querySelectorAll(`input[name="${field.name}"]`);
                  isValid = Array.from(radioGroup).some(radio => radio.checked);
                  if (!isValid) errorMessage = 'Por favor, selecciona una opción.';
              }

              if (field.type === 'checkbox' && field.name === 'services') {
                const servicesGroup = form.querySelectorAll('input[name="services"]');
                isValid = Array.from(servicesGroup).some(cb => cb.checked);
                if (!isValid) errorMessage = 'Por favor, selecciona al menos un servicio.';
              }

              if (isValid) {
                  field.classList.remove('is-invalid');
                  field.classList.add('is-valid');
                  if (errorContainer) errorContainer.style.display = 'none';
              } else {
                  field.classList.remove('is-valid');
                  field.classList.add('is-invalid');
                  if (errorContainer && showMessage) {
                    errorContainer.textContent = errorMessage;
                    errorContainer.style.display = 'block';
                  }
              }
              return isValid;
          }

          function validateForm() {
              let isFormValid = true;
              let firstInvalidField = null;

              form.querySelectorAll('input[required], textarea[required], select[required], input[type="url"]').forEach(field => {
                  const isFieldValid = validateField(field);
                  if (!isFieldValid) {
                      isFormValid = false;
                      if (!firstInvalidField) firstInvalidField = field;
                  }
              });

              submitButton.disabled = !isFormValid;
              return { isValid: isFormValid, firstInvalidField };
          }

          allInputs.forEach(input => {
              const eventType = (input.type === 'radio' || input.type === 'checkbox' || input.tagName === 'SELECT') ? 'change' : 'input';
              input.addEventListener(eventType, () => validateForm());
              input.addEventListener('blur', () => validateField(input));
          });

          /**
           * Guarda el progreso del formulario en localStorage.
           */
          function saveProgress() {
            const data = {};
            form.querySelectorAll('input, textarea, select').forEach(el => {
              const name = el.name;
              if (!name) return;

              if (el.type === 'checkbox') {
                if (!data[name]) data[name] = [];
                if (el.checked) data[name].push(el.value);
              } else if (el.type === 'radio') {
                if (el.checked) data[name] = el.value;
              } else {
                data[name] = el.value;
              }
            });
            localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(data));
          }

          /**
           * Carga el progreso del formulario desde localStorage.
           */
          function loadProgress() {
            const savedDataJSON = localStorage.getItem(ONBOARDING_STORAGE_KEY);
            if (!savedDataJSON) return;

            try {
              const data = JSON.parse(savedDataJSON);
              form.querySelectorAll('input, textarea, select').forEach(el => {
                const name = el.name;
                if (data.hasOwnProperty(name)) {
                  if (el.type === 'checkbox') {
                    el.checked = Array.isArray(data[name]) && data[name].includes(el.value);
                  } else if (el.type === 'radio') {
                    el.checked = data[name] === el.value;
                  } else {
                    el.value = data[name];
                  }
                }
              });
            } catch (e) { console.error("Error al cargar datos del formulario desde localStorage", e); }
          }

          /** 
           * Genera el mensaje de WhatsApp con los datos del formulario de onboarding.
           * @returns {string} Mensaje formateado para WhatsApp.
           */
          function generateOnboardingWhatsAppMessage() {
              const formData = new FormData(form);
              let message = `📝 *Nuevo Lead de Onboarding* 📝

`;

              // Recolecta todos los datos del formulario y los formatea
              for (let [key, value] of formData.entries()) {
                  const field = form.querySelector(`[name="${key}"]`);
                  const label = field ? (field.labels[0] || field.closest('.form-group')?.querySelector('.form-label')) : null;
                  if (value && label) {
                      // Agrupa checkboxes
                      if (formData.getAll(key).length > 1) {
                          if (message.includes(`*${label.textContent}*`)) continue; // Evita duplicados
                          message += `*${label.textContent}* ${formData.getAll(key).join(', ')}
`;
                      } else {
                          message += `*${label.textContent}* ${value}
`;
                      }
                  }
              }
              message += `
¡Contactar para dar seguimiento!`;
              return message;
          }

          /**
           * Genera un resumen del formulario en formato Markdown.
           * @returns {string} Resumen en Markdown.
           */
          function generateMarkdownSummary() {
              const formData = new FormData(form);
              let md = `# Resumen de Onboarding del Proyecto

`;

              const sections = {
                'Objetivos': ['project-goals', 'project-success'],
                'Recursos de Marca': ['brandManual', 'vectorLogo', 'brand-colors', 'reference-site', 'social-media', 'whatsappIntegration', 'future-features'],
                'Catálogo de Pantallas': ['screen-count', 'screenInfo', 'digitizedInfo', 'infoFormat'],
                'Buscador y Filtros': ['filters'],
                'Mapa': ['gpsCoordinates'],
                'Dashboard y Gestión': ['platformAdmins', 'permissions'],
                'Infraestructura y Migración': ['hasHosting', 'hostingProvider', 'hostingAccess', 'domain-name', 'domainAdmin', 'domainAccess', 'hasEmail', 'emailCount', 'emailProvider', 'hasBackup', 'toolAccess']
              };

              for (const sectionTitle in sections) {
                  md += `## ${sectionTitle}

`;
                  let sectionHasContent = false;

                  sections[sectionTitle].forEach(fieldName => {
                      const field = form.querySelector(`[name="${fieldName}"]`);
                      if (!field) return;

                      const label = field.closest('.form-group')?.querySelector('.form-label');
                      if (!label) return;

                      const values = formData.getAll(fieldName);
                      if (values.length > 0 && values[0] !== '') {
                          sectionHasContent = true;
                          if (values.length > 1) {
                              // Checkboxes
                              md += `**${label.textContent.trim()}:**
`;
                              values.forEach(val => {
                                  md += `- ${val}
`;
                              });
                              md += '
';
                          } else {
                              // Text, Textarea, Radio
                              md += `**${label.textContent.trim()}:**
${values[0]}

`;
                          }
                      }
                  });

                  if (!sectionHasContent) {
                      md += `*No se proporcionó información en esta sección.*

`;
                  }
              }

              return md;
          }


          form.addEventListener('submit', function(event) {
              event.preventDefault();
              const { isValid, firstInvalidField } = validateForm();
              if (!isValid) {
                  statusMessage.textContent = 'Por favor, completa todos los campos requeridos.';
                  statusMessage.className = 'form-status is-error';
                  firstInvalidField?.focus();
                  return; 
              }

              statusMessage.textContent = 'Enviando...';
              statusMessage.className = 'form-status';
              submitButton.disabled = true;

              try {
                  // Generar y mostrar el resumen en Markdown en la consola
                  const markdownSummary = generateMarkdownSummary();
                  console.log("--- Resumen del Onboarding en Markdown ---");
                  console.log(markdownSummary);

                  const message = generateOnboardingWhatsAppMessage();
                  const whatsappNumber = window.SmartKitShared?.DEFAULT_BRAND?.whatsapp;
                  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

                  localStorage.removeItem(ONBOARDING_STORAGE_KEY); // Limpiar al enviar
                  window.open(whatsappUrl, '_blank');

                  form.style.display = 'none';
                  document.getElementById('success-message').style.display = 'block';
              } catch (error) {
                  console.error('Error al generar el enlace de WhatsApp:', error);
                  statusMessage.textContent = `Error: No se pudo generar el enlace.`;
                  statusMessage.className = 'form-status is-error';
                  submitButton.disabled = false;
              }
          });

          // Cargar, actualizar y validar
          loadProgress();
          toggleHostingDetails(); // Asegurarse de que los campos condicionales se muestren
          toggleEmailDetails();
          validateForm(false); // Validar sin mostrar errores al inicio

          // Guardar progreso en cada cambio
          form.addEventListener('input', saveProgress);
          form.addEventListener('change', saveProgress);
      }
    });
  