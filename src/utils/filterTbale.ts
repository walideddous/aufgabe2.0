// compare two table and filter them to get the common part
export const tableaufiltrer = (tab1: any, tab2: any) => {
  const tableToCompare = tab2.trajekt.items.map((el: any) => el.name);
  return tab1.filter((el: any) => tableToCompare.includes(el.Haltestelle));
};
