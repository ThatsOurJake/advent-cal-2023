export default function isValid(value: number) { return new Date(2023, 11, value).valueOf() <= Date.now() };

