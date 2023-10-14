import hbs from 'handlebars';

export async function load({locals, params}) {
  const id = params.page;

  const page = await locals.api.getPage(id)
  
  return {
    page
  };
}
