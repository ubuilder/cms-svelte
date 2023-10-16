<script lang="ts">
  import { goto } from "$app/navigation";
  import FieldInput from "$lib/components/content/FieldInput.svelte";
  import { Button, ButtonList, PageHeader, Card, CardBody, El, Icon } from "@ulibs/yesvelte";

  export let data;

  async function onSubmit() {
    const value2: any = {};

    for (let field of data.table.fields) {
      value2[field.name] = value[field.name];
    }

    await fetch("../" + "?/insert", {
      method: "POST",
      body: JSON.stringify(value2),
    }).then((res) => res.json());
    await goto("../", {invalidateAll: true});
  }

  let value: any = data.table.fields.reduce((prev, curr) => {
    return {...prev, [curr.name]: curr.default_value}
  }, {});
</script>

<El container="lg">
  <PageHeader title="Insert {data.table.name}">
    <Button href="../">
      <Icon name="chevron-left" />
      Back
    </Button>
  </PageHeader>

  <Card mt="4" tag="form" on:submit={onSubmit}>
    <CardBody row>
      {#each data.table.fields as field}
        <FieldInput {field} bind:data={value} />
      {/each}

      <El col d="flex" mt="3">
        <ButtonList ms="auto">
          <Button>Cancel</Button>

          <Button type="submit" color="primary">
            <Icon name="plus" />
            Insert
          </Button>
        </ButtonList>
      </El>
    </CardBody>
  </Card>
</El>
