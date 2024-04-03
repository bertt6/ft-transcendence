export function escapeHTML(str) {
return  str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}