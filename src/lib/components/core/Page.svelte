<script lang="ts">
	// import { LOGIN_PAGE, user } from '@stores'
	import { SvelteComponent, onMount } from 'svelte'
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Card,
		CardActions,
		CardBody,
		CardHeader,
		CardTitle,
		El
	} from 'yesvelte'
	import ButtonList from './ButtonList.svelte'
	// import EmptyLayout from '$lib/components/core/layout/EmptyLayout.svelte'
	// import AdminLayout from '$lib/components/core/layout/AdminLayout.svelte'

	export let roles: string | string[] = []

	export let title: string | undefined

	export let htmlTitle: string | undefined = title

	// onMount(() => {
	// 	if (user.is(roles)) {
	// 	} else {
	// 		//
	// 		console.log('Not authorized')
	// 	}
	// })
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

<El px="3" container="lg">
	<!-- <Breadcrumb mt="2">
            <BreadcrumbItem>Admin</BreadcrumbItem>
            <BreadcrumbItem>Users</BreadcrumbItem>
            <BreadcrumbItem>Add User</BreadcrumbItem>
        </Breadcrumb> -->
	<El mt="3" d="flex" gap="3" alignItems="center" class="flex-wrap">
		<!-- {#if user.is(roles)} -->
			{#if title}
				<El tag="h1" mb="0">{title}</El>
			{/if}
		<!-- {:else} -->
			<!-- <El tag="h1" mb="0">No Access!</El> -->
		<!-- {/if} -->
		<ButtonList ms="auto">
			<slot name="header-buttons" />
		</ButtonList>
	</El>
	<!--  -->
	<El mt="3">
		<!-- {#if $user.authenticated && user.is(roles)} -->
			<slot />
		<!-- {:else} -->
			<!-- <Card>
				<CardHeader>
					<CardTitle>Access Denied</CardTitle>
					<CardActions>
						<ButtonList>
							<Button on:click={() => history.back()}>Back</Button>
							<Button href={LOGIN_PAGE}>Sign in</Button>
						</ButtonList>
					</CardActions>
				</CardHeader>
				<CardBody>You don't have access to this page!</CardBody>
			</Card>
		{/if} -->
	</El>
</El>
