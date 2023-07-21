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
  import tabler from "yesvelte/css/tabler.min.css?url";
</script>

<svelte:head>
  <link rel="stylesheet" href={tabler} />
</svelte:head>

<Layout>
    <svelte:fragment slot="sidebar-items">
        <SidebarItem title="Tables" icon="database">
            <SidebarItem title="Users" icon="users" href="/data/users"/>
            <SidebarItem title="Blogs" icon="file-text" href="/data/blogs"/>
            <SidebarItem title="Events" icon="database" href="/data/events"/>
                
            <!-- <El d="flex" alignItems=center justifyContent="between" slot="title">
                Data 
            </El> -->
            <El mt=1 ps="2">
                <Button href="/data/add" w="100" ><Icon name="plus" /> Add Table</Button>
            </El>

        </SidebarItem>
        <SidebarItem title="Pages" icon="file">
            <SidebarItem href="/pages/home"  icon="home" title="Home"/>
            <SidebarItem href="/pages/about-us"  icon="file" title="About Us"/>
            <SidebarItem href="/pages/contact-us"  icon="phone" title="Contact Us"/>

            <El mt=1 ps="2">
                <Button href="/pages/add" w="100" ><Icon name="plus" /> Add Page</Button>
            </El>

        </SidebarItem>
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
