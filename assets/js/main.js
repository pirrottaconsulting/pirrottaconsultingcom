(function () {
  var dialog = document.querySelector("[data-contact-dialog]");
  var openButtons = document.querySelectorAll("[data-open-contact-form]");
  var closeButtons = document.querySelectorAll("[data-close-contact-form]");
  var forms = document.querySelectorAll("[data-contact-form]");
  var lastActiveElement = null;

  function updateStartedAt(form) {
    var startedAt = form.querySelector("input[name='started_at']");
    if (startedAt) {
      startedAt.value = String(Date.now());
    }
  }

  function clearStatus(form) {
    var status = form.querySelector("[data-form-status]");
    if (!status) return;
    status.textContent = "";
    status.classList.remove("form-status--error");
  }

  function setStatus(form, message, isError) {
    var status = form.querySelector("[data-form-status]");
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("form-status--error", Boolean(isError));
  }

  function openContactForm() {
    if (!dialog) return;
    if (dialog.open) return;

    var form = dialog.querySelector("[data-contact-form]");
    lastActiveElement = document.activeElement;

    if (form) {
      updateStartedAt(form);
      clearStatus(form);
    }

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    document.body.classList.add("dialog-open");

    var firstField = dialog.querySelector("[data-contact-form] input:not([type='hidden']):not([tabindex='-1']), [data-contact-form] select, [data-contact-form] textarea");
    if (firstField) {
      firstField.focus();
    }
  }

  function closeContactForm() {
    if (!dialog) return;

    if (dialog.open && typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
      handleDialogClose();
    }
  }

  function handleDialogClose() {
    document.body.classList.remove("dialog-open");

    if (lastActiveElement && typeof lastActiveElement.focus === "function") {
      lastActiveElement.focus();
    }
  }

  openButtons.forEach(function (button) {
    button.addEventListener("click", openContactForm);
  });

  closeButtons.forEach(function (button) {
    button.addEventListener("click", closeContactForm);
  });

  if (dialog) {
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) {
        closeContactForm();
      }
    });

    dialog.addEventListener("close", handleDialogClose);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && dialog.hasAttribute("open") && typeof dialog.close !== "function") {
        closeContactForm();
      }
    });
  }

  forms.forEach(function (form) {
    var submit = form.querySelector("button[type='submit']");
    var endpoint = form.getAttribute("data-endpoint");

    updateStartedAt(form);

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!endpoint) {
        setStatus(form, "The form is not available yet. Please use LinkedIn or WhatsApp.", true);
        return;
      }

      var data = new FormData(form);
      var payload = {};
      data.forEach(function (value, key) {
        payload[key] = value;
      });

      if (submit) {
        submit.disabled = true;
      }
      setStatus(form, "Sending...", false);

      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          return response.json().then(function (body) {
            if (!response.ok || !body.ok) {
              throw new Error(body.message || "Something went wrong. Please try again.");
            }
            return body;
          });
        })
        .then(function (body) {
          form.reset();
          updateStartedAt(form);
          setStatus(form, body.message || "Thanks. Your message has been sent.", false);
        })
        .catch(function (error) {
          setStatus(form, error.message || "Something went wrong. Please try again.", true);
        })
        .finally(function () {
          if (submit) {
            submit.disabled = false;
          }
        });
    });
  });
})();
