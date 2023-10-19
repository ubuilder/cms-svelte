<script lang="ts">
  import { browser } from "$app/environment";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import {
    ButtonList,
    Layout,
    Page,
    Card,
    CardBody,
    CardFooter,
    CardActions,
    Button,
    FormInput,
    El,
    CardHeader,
  } from "@ulibs/yesvelte";
  // import { Identity, routeTo } from '@services'
  // import { news, user } from '@stores'
  // import Logo from '@components/layout/Logo.svelte'

  export let form;

  let loading = false;
  let request = {
    userName: "",
    password: "",
  };

  let login = async () => {
    // loading = true
    // try {
    // 	await $user.login(request)
    // 	if ($user.isInRole('INVESTOR')) {
    // 		news.load()
    // 		await routeTo('')
    // 	} else if ($user.isInRole('MARKETER')) {
    // 		news.load()
    // 		await routeTo('marketer')
    // 	} else {
    // 		await routeTo('admin')
    // 	}
    // } catch (err) {
    // 	console.error(err)
    // } finally {
    // 	loading = false
    // }
  };
  import tabler from "yesvelte/css/tabler.min.css?url";

  $: if (browser && form?.success) {
    goto("/admin");
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href={tabler} />
</svelte:head>

<Layout
theme="dark"
  sidebar={false}
  header={false}>
  <Page
    title=""
    roles="">
    <El
      mt="5"
      pt="5"
      row>
      <El
        colMd="3"
        colXl="4"
        d="none"
        dMd="block" />
      <El
        colMd="6"
        colXl="4">
        <form
          method="POST"
          action="?/login"
          use:enhance>
          <Card>
            <CardHeader
              py="3"
              px="4">
              <El tag="h1">UBuilder</El>
            </CardHeader>
            <CardBody>
              <El tag="h1">Login From</El>
              <FormInput
                name="username"
                value=""
                label="Username"
                required
                col="12"
                state={form?.field === "username" ? "invalid" : undefined}
                hint={form?.field === "username" ? form?.message : ""} />
              <FormInput
                value=""
                label="Password"
                name="password"
                type="password"
                state={form?.field === "password" ? "invalid" : undefined}
                hint={form?.field === "password" ? form?.message : ""}
                autocomplete
                required
                col="12" />
            </CardBody>
            <CardFooter>
              <CardActions>
                <ButtonList>
                  <Button
                    type="button"
                    href="/auth/register">
                    Do not have an account
                  </Button>
                  <Button
                    type="button"
                    on:click={async () => await routeTo("account/forgot-password")}>
                    Forgot Password
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    {loading}>Log in</Button>
                </ButtonList>
              </CardActions>
            </CardFooter>
          </Card>
        </form>
      </El>
      <El
        colMd="3"
        colXl="4"
        d="none"
        dMd="block" />
    </El>
  </Page>
</Layout>
