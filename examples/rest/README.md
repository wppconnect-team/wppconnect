# Exemplo para consumir a Lib via REST

2 formas foram criadas neste exemplo
	Requisição via GET para saber o status de conexão com o WhatsApp
	http://127.0.0.1:3000/getconnectionstatus
	
	Requisição via POST para envio de mensagem 
	http://127.0.0.1:3000/sendmessage
		os parâmetros que devem ser passados são:

		{
			"telnumber": "554190000000",
			"message": "Envio de mensagem WPPCONNECT!!!!"
		}
		

		curl --location --request POST 'http://127.0.0.1:3000/sendmessage' \
		--header 'Content-Type: application/json' \
		--data-raw '{
			"telnumber": "554190000000",
			"message": "Envio de mensagem WPPCONNECT!!!!"
		}'		
		



# Example to consume Lib via REST

2 shapes were created in this example
	GET request to know the connection status with WhatsApp
	http://127.0.0.1:3000/getconnectionstatus
	
	
	Request via POST to send a message
	http://127.0.0.1:3000/sendmessage
	
	the parameters that must be passed are:
	
		{
			"telnumber": "554190000000",
			"message": "Envio de mensagem WPPCONNECT!!!!"
		}
		
		
		curl --location --request POST 'http://127.0.0.1:3000/sendmessage' \
		--header 'Content-Type: application/json' \
		--data-raw '{
			"telnumber": "554190000000",
			"message": "Envio de mensagem WPPCONNECT!!!!"
		}'		
				
