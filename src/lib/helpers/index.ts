import hbs from 'handlebars'
export function renderVariable(template: string | any, items: any) {
    if (typeof template === "string") {
      return hbs.compile(`${template}`)(items);
    } else if (typeof template === "object" && !Array.isArray(template)) {
      const result: any = {};
  
      Object.keys(template).map((key) => {
        result[key] = renderVariable(template[key], items);
      });
      return result;
    }
    return template;
  }