<script lang="ts">
  import { FormCheckbox, FormField, El, Icon, Accordion, AccordionHeader, Button, FormRadioGroup, FormSwitch, AccordionBody, Badge, FormInput,  FormAutocomplete, Accordions, FormSlider, FormSelect, FormCheckboxGroup } from "yesvelte";

  export let fields: any[] = [];
  export let tables: any[] = [];
  
  const icons: any = {
    plain_text: "abc",
    rich_text: "float-left",
    date_time: "calendar",
    switch: "toggle-right",
    number: "123",
    file: "file-text",
    image: "photo",
    relation: "database-share",
    select: "list",
  };

  const selectItems = [
    { key: "plain_text", text: "Plain Text" },
    { key: "rich_text", text: "Rich Text" },
    { key: "number", text: "Number" },
    { key: "date_time", text: "DateTime" },
    { key: "image", text: "Image" },
    { key: "file", text: "File" },
    { key: "switch", text: "Switch" },    
    { key: "select", text: "Select" },
    { key: "relation", text: "Relation" },
  ];


  let new_name = "";
  let new_type = "";


</script>
<FormField label="Fields">
    <Accordions>
      {#each fields as field}
        <Accordion mb="2">
          <AccordionHeader border>
            <El d="flex" alignItems="center" gap="2">
              <Icon name={icons[field.type]} />
              <El tag="span" mx="2">
                {field.name}
              </El>
              {#if field.required}
                <Badge
                  on:click!stopPropagation={() =>
                    (field.required = !field.required)}
                  color="danger">Required</Badge
                >
              {:else}
                <Badge
                  on:click!stopPropagation={() =>
                    (field.required = !field.required)}
                  color="info">Optional</Badge
                >
              {/if}
              {#if ["select", "image", "relation"].includes(field.type)}
                {#if field.mode === "single"}
                  <Badge
                    on:click!stopPropagation={() =>
                      (field.mode = "multiple")}
                    color="info"
                  >
                    Single
                  </Badge>
                {:else}
                  <Badge
                    on:click!stopPropagation={() => (field.mode = "single")}
                    color="info"
                  >
                    Multiple
                  </Badge>
                {/if}
              {/if}
            </El>
          </AccordionHeader>
          <AccordionBody>
            <El row>
              <FormInput
                col="12"
                colSm="6"
                label="Name"
                bind:value={field.name}
              />
              <FormAutocomplete
                col="12"
                colSm="6"
                label="type"
                key="key"
                items={selectItems}
                bind:value={field.type}
                let:item
              >
                <El>
                  <Icon me="2" name={icons[item.key]} />
                  {item.text}
                </El>
              </FormAutocomplete>
              <FormInput col="12" label="Hint" bind:value={field.hint} />
              <FormInput col="12" label="Placeholder" bind:value={field.placeholder} />

              <El my="2" borderBottom/>
              {#if field.type === "plain_text"}
                <FormInput
                  colMd="6"
                  type="number"
                  bind:value={field.minlength}
                  label="Min Length"
                />
                <FormInput
                  colMd="6"
                  type="number"
                  bind:value={field.maxlength}
                  label="Max Length"
                />
                <FormRadioGroup items={['input', 'textarea']} label="Input type" bind:value={field.input_type}/>
              {:else if field.type === "number"}
                <FormInput colSm type="number" bind:value={field.min} label="Min" />
                <FormInput colSm type="number" bind:value={field.max} label="Max" />
                <FormSwitch
                  colSm="auto"
                  label="Allow Negative?"
                  bind:value={field.negative}
                />
              {:else if field.type === "select"}
                <FormInput bind:value={field.options} label="Options" />
                <FormRadioGroup
                  inline
                  items={["single", "multiple"]}
                  label="Mode"
                  bind:value={field.mode}
                />
              {:else if field.type === 'date_time'}
                <FormSwitch label="Range?" bind:checked={field.range}/>
              {:else if field.type === 'relation'}
                <FormAutocomplete col="9" label="Table" bind:value={field.table} key="slug" items={tables} let:item>
                  <Icon me="2" name={item.icon} />
                  {item.name}
                </FormAutocomplete>
                <FormCheckbox col="3" label="Multiple" bind:checked={field.multiple}/>
                
                <FormSelect items={tables.find(x => x.slug === field.table)?.fields ?? []} label="Title" bind:value={field.title} key="name" let:item>
                  {item.name}
                  </FormSelect>
              {/if}

              <El col="12" d="flex" justifyContent="end">
                <Button
                  ms="auto"
                  color="danger"
                  on:click={() =>
                    (fields = fields.filter(
                      (x) => x !== field
                    ))}
                >
                  Remove
                </Button>
              </El>
            </El>
          </AccordionBody>
        </Accordion>
      {/each}
    </Accordions>

    <El
      tag="form"
      on:submit!preventDefault={() => {
        if(new_name === '' || new_type === '') return;
        fields = [
          ...fields,
          { name: new_name, type: new_type, mode: 'single' },
        ];
        new_name = "";
        new_type = "";
      }}
      row
      mt=4
    >
        <FormInput col=12 colSm bind:value={new_name} placeholder="Name of new field..." />
        <FormAutocomplete
        col=12 colSm
          placeholder="Type of new field..."
          key="key"
          items={selectItems}
          bind:value={new_type}
          let:item
        >
          <El>
            <Icon me="2" name={icons[item.key]} />
            {item.text}
          </El>
        </FormAutocomplete>

      <El col="auto">
        <Button color="primary" disabled={new_name === '' || new_type === ''} type="submit">Add Field</Button>
      </El>
    </El>
  </FormField>