const data = {
    customerDetail: {
        firstName: "Test",
        lastName: "Test",
        email: "test@test.com",
        phone: "123456789",
        address: "123 Test St",
        city: "Test",
        province: "Punjab",
        zipCode: "12345"
    },
    orderItems: [{
        product: "64b6f7a8e4b0df1f2c3b4d5a",
        name: "Test Product",
        size: "M",
        quantity: 1,
        price: 100
    }],
    totalAmount: 100,
    paymentMethod: "COD"
};

fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
})
    .then(res => res.json())
    .then(console.log)
    .catch(console.error);
