// This is an example of a very specific use case, it should be trivial to generalise this for wider use.
class CustomMenuList extends HTMLElement {
  constructor() {
    super();
    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
      .dropdown {
        display: none;
        position: absolute;
        background-color: #f1f1f1;
        min-width: 160px;
        overflow: auto;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
      }

      .show {
        display: block;
      }

      .engine-option {
        background-position: left;
        background-size: contain;
        background-repeat: no-repeat;
      }

      .engine-option:hover {
        background-color: aquamarine;
      }

      #engineIcon[src=""] {
        display: none;
      }
      </style>
      // This is similar to a react render() call, we could also return this as the result of a
      // render() method.
      <img id="engineIcon" src=""></img>
      <img id="dropIcon" src="chrome://global/skin/icons/arrow-down.svg"></img>
      <div id="selectedEngine">Select Engine</div>
      <div class="dropdown"></div>
      `;

    // Add a cick listener to toggle the dropdown
    this.addEventListener("click", event => {
      this.dropdown.classList.toggle("show");
    });

    // Add a window listener to close the dropdown if we click out
    window.addEventListener("click", event => {
      // This is the class of the parent element, i.e. <custom-menulist class="default-search-select" />
      if (!event.target.matches(".default-search-select")) {
        if (this.dropdown.classList.contains("show")) {
          this.dropdown.classList.remove("show");
        }
      }
    });
  }

  get dropdown() {
    return this.shadowRoot.querySelector(".dropdown");
  }

  get selected() {
    return this.shadowRoot.getElementById("selectedEngine");
  }

  // Getter and setter for the selected value of the dropdown
  get value() {
    return this.getAttribute("value", "");
  }

  set value(value) {
    this.setAttribute("value", value);
    this.selected.innerText = value;
  }

  set icon(image) {
    this.shadowRoot
      .getElementById("engineIcon")
      .setAttribute("src", image ? image : "");
  }

  // Append a new option to the dropdown
  addOption(option) {
    option.addEventListener("click", event => {
      // On option click, update parent props
      this.value = event.composedTarget.getAttribute("value");
      this.icon = event.composedTarget.getAttribute("image");
    });

    // Do any additional manipulation that should be applied to all elements of this type.
    // Generally we should avoid doing this here and manipulate elements prior to adding.
    option.classList.add("engine-option");
    option.style.backgroundImage = `url(${option.getAttribute("image")})`;

    // Actually append the option
    this.dropdown.appendChild(option);
  }

  removeAllItems() {
    this.dropdown.replaceChildren();
  }
}

// define the my-dropdown custom element
customElements.define("custom-menulist", CustomMenuList);
