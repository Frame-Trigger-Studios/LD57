import {LD57} from "./LD57.ts";
import "./main.css";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="main" style="align-items: center; justify-content: center; height: 100%; display: flex">
  </div>
<!--    <canvas id="detect-render" width="768" height="768"></canvas>-->
`

const main = document.querySelector<HTMLDivElement>('#main')!;

const game = new LD57();

main.appendChild(game.renderer.view);
game.renderer.view.focus();
game.start();