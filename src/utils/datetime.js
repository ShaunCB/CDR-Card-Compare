import {pattern, parse} from 'iso8601-duration'
import pluralize from 'pluralize'

export function format(rfc3339DateTime) {
  const date = new Date(Date.parse(rfc3339DateTime)).toString()
  const index = date.indexOf('GMT')
  if (index > 0) return date.substring(0, index)
  return date
}

export function isDuration(str) {
  return pattern.test(str)
}

export function parseDurationText(value) {
  if (!value || !pattern.test(value)) return value;
  const duration = parse(value);
  const units = ['year', 'month', 'day', 'hour', 'minute', 'second'];
  const parts = [];
  units.forEach(unit => {
    const num = duration[unit + 's'];
    if (num) {
      parts.push(`${num} ${pluralize(unit, num)}`);
    }
  });
  return parts.join(' ');
}
