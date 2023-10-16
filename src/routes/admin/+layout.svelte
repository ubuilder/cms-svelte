<script>
  import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardBody,
    CardHeader,
    CardTitle,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    El,
    SidebarItem,
    Layout
  } from "@ulibs/yesvelte";

  import { goto } from "$app/navigation";

  const apps = [
    {
      id: "xvsawe",
      slug: "test-api",
      repo: "ubuilder/cms-app-test-api",
      url: "https://cms-app-test-api.hadiahmadi.dev",
      name: "Test API",
      icon: "test",
    },
  ];

  export let data;

  const show_auth_warning = true;

  async function logout() {
    const result = await fetch("/auth?/logout", {
      method: "POST",
      body: JSON.stringify({}),
    }).then((res) => res.json());

    goto("/auth/login");
  }

  function hasAccess() {
    return !!data.user;
  }
</script>

<Layout title="UBuilder" theme={data.theme} dir={data.dir}>
  <svelte:fragment slot="sidebar-items">
    <SidebarItem title="Dashboard" icon="dashboard" href="/admin" />
    <SidebarItem title="Content" icon="database" href="/admin/content" />
    <SidebarItem title="Pages" href="/admin/pages" icon="file" />
    <SidebarItem title="Assets" href="/admin/assets" icon="photo" />
    <SidebarItem title="Apps" href="/admin/apps" icon="building-store" />
    <SidebarItem title="Settings" href="/admin/settings" icon="settings" />
  
    {#each apps as app}
      <SidebarItem
        title={app.name}
        href="/admin/apps/{app.slug}"
        icon={app.icon}
      />
    {/each}
  </svelte:fragment>
  <svelte:fragment slot="header-end">
    <El>
      {#if data.user}
        <Dropdown arrow={false} placement="bottom-end">
          <Avatar slot="target" shape="circle" color="primary">
            {#if data.user.profile}
              <img alt="profile" src="/files/{data.user.profile}" />
            {:else}
              <img alt="profile" src="/images/avatar.png" />
            {/if}
          </Avatar>
          <DropdownMenu>
            <DropdownItem>Profile</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <DropdownItem divider />
            <DropdownItem on:click={logout}>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      {/if}
    </El>
  </svelte:fragment>
  {#if hasAccess()}
    {#if data.show_auth_warning && data.user.username === "default"}
      <El
        py="2"
        textColor="warning"
        bgColor="warning"
        bgOpacity="25"
        borderBottom
        borderColor="warning"
      >
        <El container="lg">
          You have access to CMS because
          <El textColor="warning" bgColor="light" bgOpacity="25" tag="code">
            enable_test_user
          </El> is true in
          <El textColor="warning" bgColor="light" bgOpacity="25" tag="code">
            src/hooks.server.ts
          </El> file. This warning will be hidden in production.
          <br />
          if you do not want to see this message please login <El
            tag="a"
            href="/auth/login">here</El
          >
        </El>
      </El>
    {/if}
    <slot />
  {:else}
    <Card m="3">
      <CardHeader>
        <CardTitle>No Access</CardTitle>
        <CardActions>
          <Button href="/auth/login">Login</Button>
        </CardActions>
      </CardHeader>
      <CardBody>You don't have access to this page</CardBody>
    </Card>
  {/if}
</Layout>

<style>
  :global(.y-form-input .y-label) {
    padding: 0;
  }
</style>
