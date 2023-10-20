<script lang="ts">
	import { enhance } from "$app/forms"
  import { goto, invalidateAll } from "$app/navigation";
  import FieldInput from "$lib/components/content/FieldInput.svelte";
	import { t } from "$lib/i18n"
	import type { SubmitFunction } from "@sveltejs/kit"
  import { Button, ButtonList, PageHeader, Card, CardBody, El, Icon } from "@ulibs/yesvelte";

  export let data;  
  export let form;

  let value: any = data.table.fields.reduce((prev, curr) => {
    return {...prev, [curr.name]: curr.default_value}
  }, {});
</script>

<El container="lg">
  <PageHeader title="Insert {data.table.name}">
    <Button href="../">
      <Icon name="chevron-left" />
      {t("buttons.back")}
    </Button>
  </PageHeader>

  <Card mt="4">
    <form method="POST" action="?/insert" use:enhance>
    <CardBody row>
      {#each data.table.fields as field}
        {@const errorMessage = form?.field === field.name ? form.message : undefined}
        <FieldInput {errorMessage} {field} bind:data={value} />
      {/each}


      <El col d="flex" mt="3">
        <ButtonList ms="auto">
          <Button>{t("buttons.cancel")}</Button>

          <Button type="submit" color="primary">
            <Icon name="plus" />
            {t("buttons.insert")}
          </Button>
        </ButtonList>
      </El>
    </CardBody>
</form>
</Card>

</El>
