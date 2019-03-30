import p5 from "p5";
import { Box6 } from "../../box_6";
import { Box18 } from "../../box_18";
import { Box6Graphics } from "../../box_6_graphics";
import { Box18Graphics } from "../../box_18_graphics";
import { Field } from "../../field";
import { FieldGraphics } from "../../field_graphics";
import { P5AnimationEngine } from "../../p5_animation_engine";
import { PostGraphics } from "../../post_graphics";
import { Post } from "../../post";

const symmetricalBoxesCoordinates = (
  field: Field, xlengthRatio: number, ylengthRatio: number) => {
    const xlength = xlengthRatio * field.xlength;
    const ylength = ylengthRatio * field.ylength;
    const yOffset = (1 - ylengthRatio) / 2;
    const yStart = field.y + (yOffset * field.ylength);
    const xStartA = field.x;
    const xStartB = (field.x + field.xlength) - xlength;

    return [
            [xStartA, yStart, xlength, ylength],
            [xStartB, yStart, xlength, ylength]
          ];
        }

const BOX6_XLENGTH_TO_FIELD_XLENGTH = 0.06;
const BOX6_YLENGTH_TO_FIELD_YLENGTH = 0.28;
const BOX18_XLENGTH_TO_FIELD_XLENGTH = 0.17;
const BOX18_YLENGTH_TO_FIELD_YLENGTH = 0.58;
const POST_XLENGTH_TO_FIELD_XLENGTH = 0.01;
const POST_YLENGTH_TO_FIELD_YLENGTH = 0.15;

const sketch = (p: p5) => {
  const field = new Field(0, 0, p.windowWidth, p.windowHeight);
  const [postACoordinates, postBCoordinates] = symmetricalBoxesCoordinates(
    field, POST_XLENGTH_TO_FIELD_XLENGTH, POST_YLENGTH_TO_FIELD_YLENGTH);

  const postA = new Post(...postACoordinates);
  const postB = new Post(...postBCoordinates);
  const posts = [postA, postB];

  const [box18ACoordinates, box18BCoordinates] = symmetricalBoxesCoordinates(
    field, BOX18_XLENGTH_TO_FIELD_XLENGTH, BOX18_YLENGTH_TO_FIELD_YLENGTH);

  const box18A = new Box18(...box18ACoordinates);
  const box18B = new Box18(...box18BCoordinates);
  const box18s = [box18A, box18B];

  const [box6ACoordinates, box6BCoordinates] = symmetricalBoxesCoordinates(
    field, BOX6_XLENGTH_TO_FIELD_XLENGTH, BOX6_YLENGTH_TO_FIELD_YLENGTH);

  const box6A = new Box6(...box6ACoordinates);
  const box6B = new Box6(...box6BCoordinates);
  const box6s = [box6A, box6B];

  const animationEngine = new P5AnimationEngine(p);
  const fieldGraphics = new FieldGraphics(animationEngine);
  const postGraphics = new PostGraphics(animationEngine);
  const box6Graphics = new Box6Graphics(animationEngine);
  const box18Graphics = new Box18Graphics(animationEngine);

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    fieldGraphics.animate(field);
    box18s.forEach((box18) => box18Graphics.animate(box18));
    box6s.forEach((box6) => box6Graphics.animate(box6));
    posts.forEach((post) => postGraphics.animate(post));
  };
};

const psketch = new p5(sketch);
