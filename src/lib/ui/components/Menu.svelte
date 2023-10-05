<script lang="ts">
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import {
    El,
    FormInput,
    Button,
    Icon,
    Navbar,
    NavbarItem,
    Offcanvas,
    OffcanvasBody,
    Sidebar,
    SidebarItem,
  } from "yesvelte";

  export let props: any = {};
  let show: boolean = false;
  export let edit = false;
</script>

{#if edit}
  <El p="3">
    <El row>
      {#each props.links ?? [] as link}
        <FormInput colSm="5" label="Text" bind:value={link.title} />
        <FormInput
          colSm="5"
          label="Link"
          bind:value={link.link}
        />
        <El colSm="2">
          <Button
            ghost
            color="danger"
            on:click={() =>
              (props.links = props.links.filter((x) => x !== link))}
          >
            <Icon name="trash" />
          </Button>
        </El>
      {/each}
      <ButtonList>

      <Button
        color="primary"
        on:click={() => (props.links = [...(props.links ?? []), {}])}
      >
        <Icon name="plus" />
        Add Link
      </Button>
    </ButtonList>

    </El>
  </El>
{:else}
  <El dMd="none">
    <Icon name="user" on:click={() => show = true}/>
    <Offcanvas placement="end" autoClose backdrop bind:show>
      <OffcanvasBody>
        <Sidebar w="100">
          {#each props.links as link}
            <SidebarItem title={link.title} icon={link.icon} href={link.link} />
          {/each}
        </Sidebar>
      </OffcanvasBody>
    </Offcanvas>
  </El>
  <El d="none" dMd="block">
    <Navbar>
      {#each props.links as link}
        <NavbarItem title={link.title} icon={link.icon} href={link.link} />
      {/each}
    </Navbar>
  </El>
{/if}

<style>
    :global(.y-navbar-wrapper) {
        background-color: transparent;

    }
    </style>