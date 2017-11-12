var client = deepstream('wss://154.deepstreamhub.com?apiKey=a70e0e84-aca5-437c-bb8e-dd7a570a6dec')

client.login({
	'type': 'email',
	'email': 'clientuser@gmail.com',
	'password': 'abcd'
}, function (success,data) {
		console.log("client logged in "+success)
		if(success){
			startApp(data)
		}else{
			console.log("deepstream Login Failed")
		}

	})

function startApp(data){
	client.event.subscribe('myEvent', (data) =>{
		console.log(data)
	})
	var myRecord = client.record.getRecord('users/123')
	myRecord.subscribe('firstname', (data) =>{
		console.log('Record data has changed. Firstname = ', data)
	})
}