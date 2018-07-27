/**
 * Muestra el tabcontent asociado al tablink seleccionado
 */
const showTab = (event) => {
  event.preventDefault();

  const tablink = event.currentTarget;
  const container = tablink.parentNode.parentNode.parentNode;
  const active = tablink.getAttribute('href');
  const tabcontent = container.querySelector(active);

  const tablinks = container.querySelectorAll('.tablinks');
  const tabcontents = container.querySelectorAll('.tabcontent');


  // Elimino la clase '.active' de todos los tablinks
  tablinks.forEach((item) => {
    item.className = item.className.replace(' active', '');
  });

  // Oculto todos los tabcontents
  tabcontents.forEach((item) => {
    item.style.display = 'none';
  });


  // Añado la clase 'active' al tablink seleccionado
  // y muestro el tabcontent correspondiente
  tablink.className += ' active';
  tabcontent.style.display = 'block';
};

export default showTab;
