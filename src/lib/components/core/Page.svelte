<script lang="ts">
  // import { LOGIN_PAGE, user } from '@stores'
  import { SvelteComponent, onMount, setContext } from "svelte";
  import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Card,
    CardActions,
    CardBody,
    CardHeader,
    CardTitle,
    El,
  } from "yesvelte";
  import ButtonList from "./ButtonList.svelte";
  import PageHeader from "./PageHeader.svelte";
  import { writable } from "svelte/store";
  // import EmptyLayout from '$lib/components/core/layout/EmptyLayout.svelte'
  // import AdminLayout from '$lib/components/core/layout/AdminLayout.svelte'

  export let roles: string | string[] = [];

  export let title: string | undefined;

  export let htmlTitle: string | undefined = title;

  const filters = writable({});

  setContext("FILTERS", filters);

  $: {
    console.log("Should refresh page: ", $filters);
  }
</script>

<svelte:head>
  <!-- {#if user.is(roles)} -->
  {#if htmlTitle}
    <title>{htmlTitle}</title>
  {/if}
  <!-- {:else} -->
  <!-- <title>No Access!</title> -->
  <!-- {/if} -->
</svelte:head>

<El container="lg">
  <PageHeader px="0" {title}>
    <slot name="header-buttons" />
  </PageHeader>

  <El mt="3">
    <slot />
  </El>
</El>
