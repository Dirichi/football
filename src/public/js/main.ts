import p5 from "p5";

const sketch = (p: p5) => {
  p.setup = () => {
    const a = 1;
  };

  p.draw = () => {
    p.ellipse(50, 50, 80, 80);
  };
};

const psketch = new p5(sketch);
