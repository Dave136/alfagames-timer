export default class Validate {
  static expiryTimestamp(expiryTimestamp: number): boolean {
    const isValid = new Date(expiryTimestamp).getTime() > 0;
    if (!isValid) {
      console.warn(
        'composables: { useTimer } Invalid expiryTimestamp settings',
        expiryTimestamp
      ); // eslint-disable-line
    }
    return isValid;
  }
}
