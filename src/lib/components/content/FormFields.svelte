<script lang="ts">
  import type { Field } from "$lib/types";
  import {
    FormCheckbox,
    FormField,
    El,
    Icon,
    Card,
    Accordion,
    AccordionHeader,
    Button,
    FormRadioGroup,
    FormSwitch,
    AccordionBody,
    Badge,
    FormInput,
    FormAutocomplete,
    Accordions,
    FormSlider,
    FormSelect,
    FormCheckboxGroup,
    Tabs,
    TabList,
    TabItem,
    TabContent,
    TabPanel,
    CardHeader,
    CardBody,
  } from "@ulibs/yesvelte";
  import FieldInput from "./FieldInput.svelte";
  import { t } from "$lib/i18n";

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
    { key: "plain_text", text: t("plain_text") },
    { key: "rich_text", text: t("rich_text") },
    { key: "number", text: t("number") },
    { key: "date_time", text: t("date_time") },
    { key: "image", text: t("image") },
    { key: "file", text: t("file") },
    { key: "switch", text: t("switch") },
    { key: "select", text: t("select") },
    { key: "relation", text: t("relation") },
  ];

  function removeField(field: Field) {
    fields = fields.filter((x) => x !== field);
  }

  function addField() {
    if (new_name === "" || new_type === "") return;

    const newField: any = {
      name: new_name,
      type: new_type,
      show_in_view: true,
      show_in_create: true,
      show_in_update: true,
      show_in_list: true,
    };

    if (newField.type === "plain_text") {
      newField.input_type = "input";
    }

    fields = [...fields, newField];
    new_name = "";
    new_type = "";
  }

  let new_name = "";
  let new_type = "";
</script>

<FormField label={t("content.forms.fields")}>
  <Accordions>
    {#each fields as field}
      <Accordion mb="2">
        <AccordionHeader class="table-field-item" border>
          <El d="flex" alignItems="center" gap="2">
            <Icon name={icons[field.type]} />
            <El tag="span" mx="2">
              {field.name}
            </El>
            {#if field.required}
              <Badge
                on:click!stopPropagation={() =>
                  (field.required = !field.required)}
                color="danger">{t("content.forms.required")}</Badge
              >
            {:else}
              <Badge
                on:click!stopPropagation={() =>
                  (field.required = !field.required)}
                color="info">{t("content.forms.optional")}</Badge
              >
            {/if}
            {#if ["select", "image", "relation"].includes(field.type)}
              <!-- {#if field.mode === "single"}
                <Badge
                  on:click!stopPropagation={() => (field.mode = "multiple")}
                  color="info"
                >
                {t('content.forms.single')}
                </Badge>
              {:else}
                <Badge
                  on:click!stopPropagation={() => (field.mode = "single")}
                  color="info"
                >
                {t('content.forms.multiple')}
                </Badge>
              {/if} -->
            {/if}
          </El>
        </AccordionHeader>
        <AccordionBody class="no-padding">
          <Card>
            <Tabs>
              <CardHeader>
                <TabList>
                  <TabItem>
                    <Icon name="adjustments" />
                    {t("content.forms.general")}
                  </TabItem>
                  <TabItem>
                    <Icon name="eye" />
                    {t("content.forms.visibility")}
                  </TabItem>
                  <TabItem>
                    <Icon name="settings" />
                    {t("content.forms.advanced")}
                  </TabItem>
                </TabList>
              </CardHeader>
              <CardBody>
                <TabContent>
                  <TabPanel>
                    <El row>
                      <FormInput
                        col="12"
                        colSm="6"
                        label={t("content.forms.name")}
                        bind:value={field.name}
                      />
                      <FormAutocomplete
                        col="12"
                        colSm="6"
                        label={t("content.forms.type")}
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
                      <!-- <FormInput
                        col="12"
                        label="Hint"
                        bind:value={field.hint}
                      /> -->

                      <FormInput
                        col="12"
                        placeholder={t("content.forms.placeholder_placeholder")}
                        label={t("content.forms.placeholder")}
                        bind:value={field.placeholder}
                      />
                      <FieldInput
                        label={t("content.forms.default_value")}
                        field={{
                          ...field,
                          name: "default_value",
                        }}
                        bind:data={field}
                      />
                    </El>
                  </TabPanel>
                  <TabPanel>
                    <El row>
                      <FormCheckbox col="6" bind:checked={field.show_in_create}>
                        {t("content.forms.show_in_create")}
                      </FormCheckbox>
                      <FormCheckbox col="6" bind:checked={field.show_in_list}>
                        {t("content.forms.show_in_list")}
                      </FormCheckbox>
                      <FormCheckbox col="6" bind:checked={field.show_in_view}>
                        {t("content.forms.show_in_view")}
                      </FormCheckbox>
                      <FormCheckbox col="6" bind:checked={field.show_in_update}>
                        {t("content.forms.show_in_update")}
                      </FormCheckbox>
                    </El>
                  </TabPanel>
                  <TabPanel>
                    <El row>
                      {#if field.type === "plain_text"}
                        <FormInput
                          colMd="6"
                          type="number"
                          bind:value={field.minlength}
                          label={t("content.forms.min_length")}
                        />
                        <FormInput
                          colMd="6"
                          type="number"
                          bind:value={field.maxlength}
                          label={t("content.forms.max_length")}
                        />
                        <FormRadioGroup
                          items={["input", "textarea"]}
                          label={t("content.forms.input_type")}
                          bind:value={field.input_type}
                        />
                      {:else if field.type === "number"}
                        <FormInput
                          colSm
                          type="number"
                          bind:value={field.min}
                          label={t("content.forms.min")}
                        />
                        <FormInput
                          colSm
                          type="number"
                          bind:value={field.max}
                          label={t("content.forms.max")}
                        />
                        <FormSwitch
                          colSm="auto"
                          label={t("content.forms.negative")}
                          bind:value={field.negative}
                        />
                      {:else if field.type === "select"}
                        <FormInput
                          bind:value={field.options}
                          label={t("content.forms.options")}
                        />
                        <FormRadioGroup
                          inline
                          key="key"
                          items={[
                            { key: "single", text: t("content.forms.single") },
                            {
                              key: "multiple",
                              text: t("content.forms.multiple"),
                            },
                          ]}
                          label={t("content.forms.mode")}
                          bind:value={field.mode}
                          let:item
                        >
                          {item.text}
                        </FormRadioGroup>
                      {:else if field.type === "date_time"}
                        <FormSwitch
                          label={t("content.forms.range")}
                          bind:checked={field.range}
                        />
                      {:else if field.type === "relation"}
                        <FormAutocomplete
                          col="9"
                          label={t("content.forms.table")}
                          bind:value={field.table}
                          key="id"
                          items={tables}
                          let:item
                        >
                          <Icon me="2" name={item.icon} />
                          {item.name}
                        </FormAutocomplete>
                        <FormCheckbox
                          col="3"
                          label={t("content.forms.multiple")}
                          bind:checked={field.multiple}
                        />
                        {#if field.multiple}
                          <FormSelect
                            items={tables.find((x) => x.id === field.table)
                              ?.fields ?? []}
                            label={t("content.forms.field")}
                            bind:value={field.field}
                            key="name"
                            let:item
                          >
                            {item.name}
                          </FormSelect>
                        {/if}

                        <FormSelect
                          items={tables.find((x) => x.id === field.table)
                            ?.fields ?? []}
                          label={t("content.forms.title")}
                          bind:value={field.title}
                          key="name"
                          let:item
                        >
                          {item.name}
                        </FormSelect>
                      {/if}

                      <El col="12" d="flex" justifyContent="end">
                        <Button
                          ms="auto"
                          color="danger"
                          on:click={() => removeField(field)}
                        >
                          {t("buttons.remove")}
                        </Button>
                      </El>
                    </El>
                  </TabPanel>
                </TabContent>
              </CardBody>
            </Tabs>
          </Card>
        </AccordionBody>
      </Accordion>
    {/each}
  </Accordions>

  <El tag="form" on:submit!preventDefault={addField} row mt="4">
    <FormInput
      col="12"
      colSm
      bind:value={new_name}
      placeholder={t("content.forms.new_field_name_placeholder")}
    />
    <FormAutocomplete
      col="12"
      colSm
      placeholder={t("content.forms.new_field_type_placeholder")}
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
      <Button
        color="primary"
        disabled={new_name === "" || new_type === ""}
        type="submit">{t("content.forms.add_field")}</Button
      >
    </El>
  </El>
</FormField>

<style>
  :global(.no-padding .y-accordion-body-inner) {
    padding: 0;
  }
</style>
