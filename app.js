function setCopiedState(button) {
  const original = button.textContent;
  button.classList.add("is-copied");
  button.textContent = "Copied";
  window.setTimeout(() => {
    button.classList.remove("is-copied");
    button.textContent = original;
  }, 1600);
}

async function copyAddress(button) {
  const value = button.getAttribute("data-copy-address") || "";
  if (!value) return;
  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "absolute";
    field.style.left = "-9999px";
    document.body.append(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }
  setCopiedState(button);
}

const copyButtons = document.querySelectorAll(".copy-address-button");
for (const button of copyButtons) {
  button.addEventListener("click", () => copyAddress(button));
}


