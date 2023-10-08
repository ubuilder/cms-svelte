<script lang="ts">
  import { browser } from "$app/environment";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import Layout from "$lib/components/core/Layout.svelte";
  import Page from "$lib/components/core/Page.svelte";
  import {
    Card,
    CardBody,
    CardFooter,
    CardActions,
    Button,
    FormInput,
    El,
    CardHeader,
  } from "yesvelte";

  export let form;
  let loading = false;
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
          use:enhance>
          <Card>
            <CardHeader
              py="3"
              px="4">
              <El tag="h1">UBuilder</El>
            </CardHeader>
            <CardBody>
				<El tag="h1">Register Form</El>
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
                    href="/auth/login">
                    Already have an account?
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    {loading}>Register</Button>
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
