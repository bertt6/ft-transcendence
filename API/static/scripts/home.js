import {notify} from "../components/Notification.js";

async function handleRouting()
{

}
(function() {
  function destroy() {
    console.log('Home script unloaded');
  }

  // Expose init and destroy to the global scope
  window.home = { destroy };
})();


