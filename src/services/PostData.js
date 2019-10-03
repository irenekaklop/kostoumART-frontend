export function PostData(type, data) {
    let BaseURL = 'http://localhost/react-costume-platform-php/api/index.php';
    
    return new Promise((resolve, reject) =>{
        fetch(BaseURL+'?tp='+type,{
        
            method: 'POST',
            headers:
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        })
        .then((response) => response.json()
        .then((res) => { 
            resolve(res); }))
        .catch((error) => { 
            reject(error); });
    });
}

