(function () {
  var form = document.querySelector("[data-contact-form]");
  if (!form) return;

  var status = form.querySelector("[data-form-status]");
  var submit = form.querySelector("button[type='submit']");
  var endpoint = form.getAttribute("data-endpoint");
  var startedAt = form.querySelector("input[name='started_at']");

  if (startedAt) {
    startedAt.value = String(Date.now());
  }

  function setStatus(message, isError) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("form-status--error", Boolean(isError));
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!endpoint) {
      setStatus("The form is not available yet. Please use LinkedIn or WhatsApp.", true);
      return;
    }

    var data = new FormData(form);
    var payload = {};
    data.forEach(function (value, key) {
      payload[key] = value;
    });

    submit.disabled = true;
    setStatus("Sending...", false);

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
        if (startedAt) {
          startedAt.value = String(Date.now());
        }
        setStatus(body.message || "Thanks. Your message has been sent.", false);
      })
      .catch(function (error) {
        setStatus(error.message || "Something went wrong. Please try again.", true);
      })
      .finally(function () {
        submit.disabled = false;
      });
  });
})();
