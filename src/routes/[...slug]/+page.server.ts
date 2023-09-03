import hbs from "handlebars";

export async function load({ locals, params }) {
  const page: any = {
    load: {
      blog: {
        table: "blogs",
        where: {
          slug: "{{page.slug}}",
        },
        with: {
          author: {
            table: "u-users",
            field: "author_id",
          },
        },
        // multiple: false
      },
    },
    props: {
      title: "{{blog.title}}",
      description: "{{blog.description}}",
      theme: "tabler",
    },
    slot: [
      {
        type: "Container",
        props: {size: 'xl'},
        slot: [
          {
            type: "Input",
            props: { value: 123 },
          },
          {
            type: "Button",
            props: {
              color: "red",
            },
            slot: ["Hello"],
          },
          {
            type: "HtmlText",
            props: {
              text: "{{{blog.content}}}",
            },
          },
          {
            type: "HtmlText",
            props: {
              text: "by {{{blog.author.name}}}",
            },
          },
        ],
      },
    ],
  };

  const props: any = {
    page: {
      slug: params.slug,
    },
  };

  for (let key in page.load) {
    const load = page.load[key];

    for (let key2 in load.where) {
      load.where[key2] = get_value(load.where[key2]);
    }

    if (load.multiple) {
      props[key] = await locals
        .db(load.table)
        .query({ where: load.where, with: load.with })
        .then((res: any) => res.data);
    } else {
      console.log("here");
      props[key] = await locals
        .db(load.table)
        .get({ where: load.where, with: load.with });
    }
  }

  function get_value(template: string) {
    return hbs.compile(`${template}`)(props);
  }

  async function render(page: any) {
    for (let key in page.props ?? {}) {
      console.log({ key });
      page.props[key] = get_value(page.props[key]);
    }

    for (let slot of page.slot) {
      for (let key in slot.props ?? {}) {
        console.log({ key });

        slot.props[key] = get_value(slot.props[key]);
      }
      if(slot.slot?.length > 0) {
        render(slot)
      }
    }

    return page;
  }

  return {
    page: await render(page),
  };
}