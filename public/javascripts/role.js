$(()=>{
	$('#submit').click(evt=>{
		const role_id = $('input[name="role_id"]').val();
		const pri_id = $('input[name="pri_id"]').val();
		$.post(`/roles/${role_id}/pris`,{pri_id:pri_id},null,res=>{
			console.info(res);
		});
	});
});
