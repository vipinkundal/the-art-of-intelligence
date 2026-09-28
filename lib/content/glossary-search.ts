export function searchGlossary<T extends {term:string; definition:string; tags:string[]}>(items:T[],query:string):T[] {
  const needle=query.trim().toLowerCase();
  if(!needle)return items;
  const rank=(item:T)=>item.term.toLowerCase()===needle?0:item.term.toLowerCase().startsWith(needle)?1:2;
  return items.filter(item=>`${item.term} ${item.definition} ${item.tags.join(" ")}`.toLowerCase().includes(needle)).sort((a,b)=>rank(a)-rank(b));
}
