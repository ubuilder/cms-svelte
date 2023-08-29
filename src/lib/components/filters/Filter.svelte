<script lang="ts">
  import { getContext, onMount } from "svelte";
  import type { Writable } from "svelte/store";

  import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    FormInput,
    Popover,
    PopoverBody,
    FormRadioGroup,
    El,
    Icon,
  } from "yesvelte";

  export let type: string = "select";

  export let items: any[] = [];

  export let text = "";
  export let key = "";

  $: allItems = [{ text: "All", key: "" }, ...items];

  const filters = getContext<Writable<any>>("FILTERS");

  if (!$filters[key]) {
    $filters[key] = {
      value: "",
      key: "=",
    };
  }
</script>

{#if type === "text"}
  <Button color={$filters[key].value !== "" ? "primary" : undefined} size="sm">
    {text}{$filters[key].value === "" ? ":" : " " + $filters[key].operator}
    {$filters[key].value || "All"}
    {#if $filters[key].value}
      <El
        on:click!stopPropagation={() => ($filters[key].value = "")}
        tag="span"
      >
        <Icon name="x" />
      </El>
    {/if}
  </Button>
  <Popover>
    <PopoverBody>
      <FormRadioGroup
        bind:value={$filters[key].operator}
        label="Type"
        key="key"
        items={[
          { key: "=", text: "Equal" },
          { key: "like", text: "Like" },
          { key: "!=", text: "Not Equal" },
        ]}
        let:item
      >
        {item.text}
      </FormRadioGroup>

      <FormInput
        on:change={(e) => ($filters[key].value = e.target.value)}
        label="Text"
        value={$filters[key].value}
      />
    </PopoverBody>
  </Popover>
{:else}
  <Dropdown placement="bottom-start">
    <Button
      color={$filters[key].value !== "" ? "primary" : undefined}
      size="sm"
    >
      {text}: {$filters[key].value !== ""
        ? items.find((x) => x.key == $filters[key].value).text
        : "All"}
      {#if $filters[key].value !== ""}
        <El
          on:click!stopPropagation={() => ($filters[key].value = "")}
          tag="span"
        >
          <Icon name="x" />
        </El>
      {/if}
    </Button>
    <DropdownMenu>
      {#each allItems as item}
        <DropdownItem on:click={() => ($filters[key].value = item.key)}>
          {item.text}
        </DropdownItem>
      {/each}
    </DropdownMenu>
  </Dropdown>
{/if}
