export default function copyTextToClipboard(text) {
  let textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();

  document.execCommand('copy');

  document.body.removeChild(textArea);
}