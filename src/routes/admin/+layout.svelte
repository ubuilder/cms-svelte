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
    } from "yesvelte";
    import Layout from "$lib/components/core/Layout.svelte";
    import tabler from "yesvelte/css/tabler.min.css?url";
  import { goto } from "$app/navigation";

    export let data;

    async function logout() {
        const result = await fetch('/auth?/logout', {method: 'POST', body: JSON.stringify({})}).then(res => res.json())

        goto('/auth/login')
    }
    

    function hasAccess() {
        return !!data.user
    }
  </script>
  
  <svelte:head>
    <link rel="stylesheet" href={tabler} />
  </svelte:head>
  
  <Layout>
      <svelte:fragment slot="sidebar-items">
        <SidebarItem title="Dashboard" icon="dashboard" href="/admin"/>             
        <SidebarItem title="Tables" icon="database" href="/admin/data"/>             
        <SidebarItem title="Pages" href="/admin/pages" icon="file" />
        <SidebarItem title="Assets" href="/admin/assets" icon="photo" />
        <SidebarItem title="Market" href="/admin/market" icon="building-store" />
  
        <SidebarItem title="Settings" href="/admin/settings" icon="settings" />
  
            
      </svelte:fragment>
      <svelte:fragment slot="header-end">
          <El>
            {#if data.user}
              <Dropdown placement="bottom-end">
                <Avatar slot="target" shape="circle" color="primary">
                  <img alt="profile" src="/files/{data.user.profile}" />
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
        <slot/>
        {:else}
        <Card title="No Access">
            <CardHeader>
                <CardTitle>No Access</CardTitle>
                <CardActions>
                    <Button href="/auth/login">Login</Button>
                    
                </CardActions>
                </CardHeader>
            <CardBody>
                You don't have access to this page
            </CardBody>
        </Card>
      {/if}
  </Layout>
  
  <style>
    :global(.y-form-input .y-label) {
      padding: 0;
    }
  </style>