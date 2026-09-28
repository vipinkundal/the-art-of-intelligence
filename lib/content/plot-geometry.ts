// Shared center for a category, separate non-overlapping slots for its series.
export function groupedBarBounds(center: number, groupWidth: number, index: number, count: number) {
  const slot=groupWidth/count;
  return {x:center-groupWidth/2+index*slot+slot*0.05,width:slot*0.9};
}
