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
  import tabler from "yesvelte/css/tabler.rtl.min.css?url";
  import { goto } from "$app/navigation";

  export let data;

  const show_auth_warning = true

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

<svelte:head>
  <link rel="stylesheet" href={tabler} />
</svelte:head>

<Layout dir="rtl">
  <svelte:fragment slot="sidebar-items">
    <SidebarItem title="داشبورد" icon="dashboard" href="/admin" />
    <SidebarItem title="محتوا" icon="database" href="/admin/content" />
    <SidebarItem title="صفحات" href="/admin/pages" icon="file" />
    <SidebarItem title="فایل ها" href="/admin/assets" icon="photo" />
    <SidebarItem title="اپلیکیشن ها" href="/admin/market" icon="building-store" />
    <SidebarItem title="تست بک اند" href="/admin/test" icon="test" />
    <SidebarItem title="تنظیمات" href="/admin/settings" icon="settings" />
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
            <DropdownItem>پروفایل</DropdownItem>
            <DropdownItem>تنظیمات</DropdownItem>
            <DropdownItem divider />
            <DropdownItem on:click={logout}>بیرون شدن</DropdownItem>
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
          شما به پروژه دسترسی دارید بخاطری که واریبل
          <El textColor="warning" bgColor="light" bgOpacity="25" tag="code">
            enable_test_user
          </El> در فایل
          <El textColor="warning" bgColor="light" bgOpacity="25" tag="code">
            src/hooks.server.ts
          </El> برابر با true است. این اخطار در پرودکشن غیر فعال خواهد بود.
          <br />
            اگر نمیخواهید این پیام را ببینید لطفا از <El tag = 'a' href = "/auth/login" >اینجا</El> لاگین کنید. 
        </El>
      </El>
    {/if}
    <slot />
  {:else}
    <Card m="3">
      <CardHeader>
        <CardTitle>عدم دسترسی</CardTitle>
        <CardActions>
          <Button href="/auth/login">لاگین</Button>
        </CardActions>
      </CardHeader>
      <CardBody>شما به این صفحه دسترسی ندارید</CardBody>
    </Card>
  {/if}
</Layout>

<style>
  :global(.y-form-input .y-label) {
    padding: 0;
  }
</style>
