import hbs from "handlebars";

export async function load({ locals, params }) {
  // const page: any = {
  //   load: {
  //     blog: {
  //       table: "blogs",
  //       where: {
  //         slug: "{{page.slug}}",
  //       },
  //       with: {
  //         author: {
  //           table: "u-users",
  //           field: "author_id",
  //         },
  //       },
  //       // multiple: false
  //     },
  //   },
  //   props: {
  //     title: "{{blog.title}}",
  //     description: "{{blog.description}}",
  //     theme: "tabler",
  //   },
  //   slot: [
  //     {
  //       type: "Container",
  //       props: {size: 'xl'},
  //       slot: [
  //         {
  //           type: "Input",
  //           props: { value: 123 },
  //         },
  //         {
  //           type: "Button",
  //           props: {
  //             color: "red",
  //           },
  //           slot: ["Hello"],
  //         },
  //         {
  //           type: "HtmlText",
  //           props: {
  //             text: "{{{blog.content}}}",
  //           },
  //         },
  //         {
  //           type: "HtmlText",
  //           props: {
  //             text: "by {{{blog.author.name}}}",
  //           },
  //         },
  //         {
  //           type: 'Container',
  //           props: {
  //             p: 'sm',
  //             style: 'display: flex; flex-direction: column; gap: 20px'
  //           },
  //           slot: [
  //             {
  //               type: 'Input',
  //               props: {placeholder: 'name...', name: 'name'}
  //             },
  //             {
  //               type: 'Input',
  //               props: {placeholder: 'email...', name: 'email', type: 'email'}
  //             },
  //             {
  //               type: 'Input',
  //               props: {placeholder: 'password...', name: 'password', type: 'password'}
  //             },
  //             {
  //               type: 'Button',
  //               props: {color: 'primary', col: '6', mx: 'auto'},
  //               slot: ['Submit']
  //             }
  //           ]
  //         }
  //       ],
  //     },
  //   ],
  // };

  console.log(locals.db("u-pages"));

  const page = await locals.db("u-pages").get({ where: { slug: params.slug } });

  const items: any = {
    page: {
      slug: params.slug,
    },
  };

  // filters: [
  //   {field: 'slug', operator: '=', value: "{{page.slug}}"}
  // ]
  // console.log(page)

  for (let load of page.load) {
    // const load = page.load[key];
    const where: any = {};

    const with_: any = {};

    for (let filter of load.filters) {
      where[filter.field] = {
        operator: filter.operator,
        value: get_value(filter.value),
      };
    }

    // const a = {
    //   author: {
    //     field: 'author_id',
    //     table: 'users',
    //     // where: {},
    //     multiple: true
    //   }

    // }

    if (load.multiple) {
      items[load.name] = await locals
        .db(load.table)
        .query({ where, with: with_ })
        .then((res: any) => res.data);
    } else {
      console.log('load: ', load)
      items[load.name] = await locals.db(load.table).get({ where, with: with_ });
    }
  }

  function get_value(template: string | any) {
    if (typeof template === "string") {
      return hbs.compile(`${template}`)(items);
    } else if (typeof template === "object" && !Array.isArray(template)) {
      const result: any = {};

      Object.keys(template).map((key) => {
        result[key] = get_value(template[key]);
      });
      return result;
    }
    return template;
  }

  async function renderSlotItem(slot: any) {
      slot.props = get_value(slot.props);

    // if (slot.type === "DynamicList") {
    //   const template = slot.props.slot;

    //   slot.props.slot = [];

    //   const items = props[slot.props.itemName];

    //   for (let item of items) {
    //     props[slot.props.name] = item;

    //     for (let index in template) {
    //       const templateItem = JSON.parse(JSON.stringify(template[index]));
    //       renderSlotItem(templateItem);
    //       slot.props.slot.push(templateItem);
    //     }
    //   }

    //   // slot.props[slot.props.itemName] = props[slot.props.itemName]
    //   props[slot.props.name] = props[slot.props.itemName];
    // }

    if (slot.slot?.length > 0) {
      for (let slotItem of slot.slot) {
        renderSlotItem(slotItem);
      }
    }
  }

  async function render(page: any) {
    page.title = get_value(page.title);
    page.description = get_value(page.description);

    for (let slot of page.slot) {
      renderSlotItem(slot);
    }

    return page;
  }

  return {
    page: await render(page),
    items
  };
}
