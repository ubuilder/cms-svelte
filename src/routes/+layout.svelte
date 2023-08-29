<script>
  import {
    Avatar,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    El,
    Icon,
    Sidebar,
    SidebarItem,
  } from "yesvelte";
  import Layout from "$lib/components/core/Layout.svelte";
  import tabler from "yesvelte/css/daisyui.min.css?url";
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
            <Dropdown placement="bottom-end">
              <Avatar slot="target" shape="circle" color="primary">
                <img alt="profile" src="/favicon.png" />
              </Avatar>
              <DropdownMenu>
                <DropdownItem>Profile</DropdownItem>
                <DropdownItem>Settings</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Logout</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </El>
        
    </svelte:fragment>
    <slot/>
</Layout>
