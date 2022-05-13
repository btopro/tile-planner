import { html, css, LitElement } from 'lit';

export class TilePlanner extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }
      .row {
        padding: 0;
        margin: 0;
        display: inline-flex;
      }
      .cell {
        padding: 0;
        margin: 0;
        height: 20px;
        width: 20px;
        border: 1px solid gray;
        display: inline-flex;
        background-color: grey;
      }
      .cell[data-color="white"] {
        background-color: white;
      }
      .cell[data-color="blue"] {
        background-color: blue;
      }
      .cell[data-color="yellow"] {
        background-color: yellow;
      }
      .cell[data-color="brown"] {
        background-color: brown;
      }
    `;
  }

  static get properties() {
    return {
      colors: { type: Array },
      rows: { type: Array },
      cols: { type: Array },
      x: { type: Number },
      y: { type: Number }
    };
  }

  constructor() {
    super();
    this.colors = ["white", "blue", "yellow"];
    this.x = 40;
    this.y = 50;
    let y =0;
    let x = 0;
    this.cols = [];
    this.rows = [];
    while (x < this.x) {
      this.cols.push('');
      x++;
    }
    while (y < this.y) {
      this.rows.push('');
      y++;
    }
  }

  render() {
    return html`
    ${this.rows.map((i,index1) => html`<div class="row" data-row="${index1}">
      ${this.cols.map((j,index2) => html`<div class="cell" data-col="${index2}" @click="${this.setColor}" data-color="brown"></div>`)}
    </div>`)}
    `;
  }

  setColor(e) {
    let color = '';
    switch(e.target.getAttribute('data-color')) {
      case 'brown':
        color = "white";
        break;

      case 'white':
        color = "blue";
        break;
        
      case 'blue':
        color = "yellow";
        break;
      case 'yellow':
        color = "brown";
      break;
    }
    console.log(e.target.getAttribute('data-color'));
    console.log(color);
    e.target.setAttribute('data-color', color);
  }
}
