export abstract class ValueObject<T> {
  constructor(protected props: T) {}

  equals(otherValueObject?: ValueObject<T>): boolean {
    if (otherValueObject === null || otherValueObject === undefined) {
      return false;
    }

    if (otherValueObject.props === undefined) {
      return false;
    }

    return (
      JSON.stringify(this.props) === JSON.stringify(otherValueObject.props)
    );
  }
}
