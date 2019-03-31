import p5 from "p5";
import { Box } from "../../box";
import { Field } from "../../field";
import { FieldGraphics } from "../../field_graphics";
import { HollowBoxGraphics } from "../../hollow_box_graphics";
import { P5AnimationEngine } from "../../p5_animation_engine";
import { Post } from "../../post";
import { PostGraphics } from "../../post_graphics";

const symmetricalBoxesCoordinates =
  (field: Field, xlengthRatio: number, ylengthRatio: number) => {
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

  const [box6ACoordinates, box6BCoordinates] = symmetricalBoxesCoordinates(
    field, BOX6_XLENGTH_TO_FIELD_XLENGTH, BOX6_YLENGTH_TO_FIELD_YLENGTH);

  const box6A = new Box(...box6ACoordinates);
  const box6B = new Box(...box6BCoordinates);
  const box18A = new Box(...box18ACoordinates);
  const box18B = new Box(...box18BCoordinates);
  const boxes = [box18A, box18B, box6A, box6B];

  const animationEngine = new P5AnimationEngine(p);
  const fieldGraphics = new FieldGraphics(animationEngine);
  const postGraphics = new PostGraphics(animationEngine);
  const hollowBoxGraphics = new HollowBoxGraphics(animationEngine);

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    fieldGraphics.animate(field);
    boxes.forEach((box) => hollowBoxGraphics.animate(box));
    posts.forEach((post) => postGraphics.animate(post));
  };
};

const psketch = new p5(sketch);
