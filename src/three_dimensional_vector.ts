// TODO: Refactor any objects that have x, y properties to use the vector class.
// This class should be tested
export class ThreeDimensionalVector {

  get x(): number {
    return this.representation[0];
  }

  get y(): number {
    return this.representation[1];
  }

  get z(): number {
    return this.representation[2];
  }

  private representation: number[];

  constructor(x: number, y: number, z: number) {
    this.representation = [x, y, z];
  }

  public equals(other: ThreeDimensionalVector): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  public toArray(): number[] {
    return [...this.representation];
  }

  public copy(): ThreeDimensionalVector {
    return new ThreeDimensionalVector(this.x, this.y, this.z);
  }

  public unit(): ThreeDimensionalVector {
    const magnitude = this.magnitude();
    return this.scalarMultiply(1 / magnitude);
  }

  public scalarMultiply(scalar: number) {
    const result = this.representation.map((value) => value * scalar);
    return new ThreeDimensionalVector(result[0], result[1], result[2]);
  }

  public isZero() {
    return this.magnitude() === 0;
  }

  public isNonZero() {
    return !this.isZero();
  }

  public add(b: ThreeDimensionalVector): ThreeDimensionalVector {
    const bArray = b.toArray();
    const result =
      this.representation.map((value, index) => value + bArray[index]);
    return new ThreeDimensionalVector(result[0], result[1], result[2]);
  }

  public minus(b: ThreeDimensionalVector): ThreeDimensionalVector {
    const negativeB = b.scalarMultiply(-1);
    return this.add(negativeB);
  }

  public squared(): ThreeDimensionalVector {
    return new ThreeDimensionalVector(
      this.x * this.x, this.y * this.y, this.z * this.z);
  }

  public magnitude(): number {
    const squared = this.squared();
    return Math.sqrt(squared.x + squared.y + squared.z);
  }

  public distanceTo(b: ThreeDimensionalVector): number {
    const diff = this.minus(b);
    return diff.magnitude();
  }

  public dotProduct(b: ThreeDimensionalVector): number {
    return (this.x * b.x) + (this.y * b.y) + (this.z * b.z);
  }

  public cosineOfAngleTo(b: ThreeDimensionalVector): number {
    return this.dotProduct(b) / (this.magnitude() * b.magnitude());
  }

  public scalarProjectionOnTo(b: ThreeDimensionalVector): number {
    return this.magnitude() * this.cosineOfAngleTo(b);
  }

  public perpendicularDistanceTo(b: ThreeDimensionalVector): number {
    const squaredDistance =
      Math.pow(this.magnitude(), 2) - Math.pow(this.scalarProjectionOnTo(b), 2);
    return Math.sqrt(squaredDistance);
  }
}
