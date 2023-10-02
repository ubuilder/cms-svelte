import hbs from 'handlebars';

export async function load({locals, params}) {
  const id = params.page;

  const page = await locals.db('u-pages').get({where: {id}})
  
  return {
    page
  };
}
