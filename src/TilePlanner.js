import { html, css, LitElement } from 'lit';

export class TilePlanner extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        margin: 100px;
      }
      .row {
        padding: 0;
        margin: 0;
        height: 10px;
        justify-content: normal;
        display: flex;
      }
      .cell {
        padding: 0;
        margin: 0;
        height: 10px;
        width: 10px;
        border: 1px solid grey;
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
      .cell[data-color="black"] {
        background-color: black
      }
      .btn {
        font-size: 8px;
        height: 10px;
        border: 0;
        margin: 0;
        padding: 0;
        width: 50px;
      }
      .btn.cols {
        height: 50px;
        width: 12px;
        overflow: hidden;
      }
      .btn:hover {
        background-color: yellow;
      }
      .top {
        margin-left: 50px;
        height: 50px;
      }
    `;
  }

  static get properties() {
    return {
      colors: { type: Array },
      grid: { type: Array },
      x: { type: Number },
      y: { type: Number },
      counter: { type: Object }
    };
  }

  resetCounter() {
    this.counter = {
      black: 0,
      white: 0,
      blue: 0,
      yellow: 0
    };
  }
  constructor() {
    super();
    this.colors = ["white", "blue", "yellow"];
    this.x = 40;
    this.y = 50;
    let y =0;
    let x = 0;
    if (!window.localStorage.getItem('tile-planner-grid')) {
      this.grid = [];
      while (y < this.y) {
        x = 0;
        this.grid[y] = [];
        while (x < this.x) {
          this.grid[y].push('black');
          x++;
        }
        y++;
      }
    }
    else {
      this.grid = JSON.parse(window.localStorage.getItem('tile-planner-grid'));
    }
    this.addEventListener('mousedown', () => {this.clicking = true;});
    this.addEventListener('mouseup', () => {this.clicking = false;});
    this.syncData();
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'grid') {
        window.localStorage.setItem('tile-planner-grid', JSON.stringify(this.grid));
      }
    });
  }

  render() {
    return html`
    <div>
      Empty: ${this.counter.black}
    </div>
    <div>
      white: ${this.counter.white}
    </div>
    <div>
      yellow: ${this.counter.yellow}
    </div>
    <div>
      blue: ${this.counter.blue}
    </div>
    <div class="top row">
    ${this.grid[0].map((h,cols) => html`
      <button class="btn cols" data-col="${cols}" @click="${this.wholeCol}">All</button>
    `)}
    </div>
    ${this.grid.map((i,index1) => html`<div class="row" data-row="${index1}">
    <button class="btn" data-row="${index1}" @click="${this.wholeRow}">All</button>
      ${i.map((j,index2) => html`
    <div class="cell"
      data-row="${index1}"
      data-col="${index2}" 
      @mouseover="${this.setColor}" 
      @click="${this.setColorClick}" 
      data-color="${this.grid[index1][index2]}"></div>`)}
    </div>`)}
    `;
  }

  syncData() {
    this.resetCounter();
    this.requestUpdate();
    window.localStorage.setItem('tile-planner-grid', JSON.stringify(this.grid));
    this.grid.forEach((i, index) => {
      i.forEach((j, jdex) => {
        this.counter[j]++;
      });
    })
  }

  wholeRow(e) {
    let row = parseInt(e.target.getAttribute('data-row'));
    for (var i=0; i < this.grid[row].length; i++) {
      this.grid[row][i] = this.__cycleColor(this.grid[row][i]);
    }
    this.syncData();
  }

  wholeCol(e) {
    let col = parseInt(e.target.getAttribute('data-col'));
    for (var i=0; i < this.grid.length; i++) {
      this.grid[i][col] = this.__cycleColor(this.grid[i][col]);
    }
    this.syncData();
  }
  setColorClick(e) {
    this.clicking = true;
    this.setColor(e);
    this.clicking = false;
  }

  setColor(e) {
    if (this.clicking) {
      const t = e.target;
      this.grid[parseInt(t.getAttribute('data-row'))][parseInt(t.getAttribute('data-col'))] = this.__cycleColor(t.getAttribute('data-color'));
      this.syncData();
    }
  }

  __cycleColor(attr) {
    let color = '';
    switch(attr) {
      case 'black':
        color = "white";
        break;
      case 'white':
        color = "blue";
        break;
        
      case 'blue':
        color = "yellow";
        break;
      case 'yellow':
        color = "black";
      break;
    }
    return color;
  }
}
