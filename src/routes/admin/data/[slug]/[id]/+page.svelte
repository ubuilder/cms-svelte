<script>
  import RelationItem from './RelationItem.svelte';

  import PageHeader from "$lib/components/core/PageHeader.svelte";
  import { Badge, Button, Card, CardBody, El, Icon, Status, Switch } from "yesvelte";

  export let data;
</script>

<El container="lg">
  <PageHeader title="Preview {data.table.name} ({data.value.id})">
    <Button on:click={() => history.back()}>
      <Icon name="chevron-left" />
      Back
    </Button>
    <Button
      color="primary"
      href="/admin/data/{data.table.slug}/{data.value.id}/edit"
    >
      Edit
    </Button>
  </PageHeader>
  <El my="4" />

  <Card mt="2">
    <CardBody>
      {#each data.table.fields as field}
        {@const value = data.value[field.name]}
        <El px="3" pt="2" class="label">{field.name}:</El>

        {#if field.type === "rich_text"}
          <El ps="5" pb="3" class="value">{@html value ?? "---"}</El>
        {:else if field.type === "image"}
          {#if value}
            <El ps="5" pb="3" class="value">
              <img class="image" src="/files/{value}" alt="" />
            </El>
          {/if}
        {:else if field.type === "date_time"}
          <El ps="5" pb="3" class="value">
            {#if value}
              {#if field.range}
                {new Date(value[0]).toDateString()} - {new Date(
                  value[1]
                ).toDateString()}
              {:else}
                {new Date(value).toDateString()}
              {/if}
            {:else}
              ---
            {/if}
          </El>
        {:else if field.type === "file"}
          {#if value}
            <El
              ps="5"
              pb="3"
              class="value"
              d="flex"
              style="flex-direction: column"
            >
              <img width="100" src="/images/file.png" alt="" />
              {value}
            </El>
          {/if}
        {:else if field.type === "switch"}
          <El ps="5" pb="3" class="value">
            <Switch checked={value} disabled />
          </El>
        {:else if field.type === "select"}
          <El ps="5" pb="3" class="value">
            {#if value}
              {#if field.multiple}
                {#each value as item}
                  <Status color="secondary">{item}</Status>
                {/each}
              {:else}
              <Status color="secondary">{value}</Status>

              {/if}
            {:else}
              ---
            {/if}
          </El>
        {:else if field.type === "relation"}
        <El ps="5" pb="3" class="value" >
        {#if field.multiple}

        
        {#each value as item}
        <RelationItem value={item} table={field.table} title={field.title}/>
        {/each}
        {:else}
        <RelationItem {value} table={field.table} title={field.title}/>
        {/if}
      </El>
        {:else}
          <El ps="5" pb="3" class="value">{value}</El>
        {/if}
      {/each}
    </CardBody>
  </Card>
</El>

<style>
  :global(.label) {
    font-weight: bold;
    font-size: 24px;
  }

  :global(.value) {
    font-size: 20px;
    margin-left: 1rem;
  }

  .image {
    width: 300px;
    height: auto;
  }
</style>
