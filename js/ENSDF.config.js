window.ENSDF={
    types:[
        {
            name:'gamma',
            level:1,
            expression:'^\d{1,3}[A-Z]{1,2} [ |1]G ',
            fields:[
                {key:'NUCID', start:0, end:5},
                {key:'ch6', start:6, end:7},
                {key:'ch7', start:8, end:7}
        ]},
        {
            name:'secondary',
            expression:'^.{7}G.*$',
            level:2,
            fields:[
                {key:'alpha', start:0, end:5},
                {key:'beta', start:5, end:9},
                {key:'omega', start:9}
        ]}
    ],
    fields:{
         'alpha':{
             input:'5',
             help:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at mollis mauris. Phasellus vulputate pretium mattis.',
             rule:'^.{5}$'
         },
         'beta':{
             input:'5',
             help:'In hac habitasse platea dictumst. Fusce finibus, lorem vitae elementum ultricies, turpis purus euismod nulla, non tempus metus odio quis lorem. Maecenas eget dolor at purus condimentum fringilla sit amet ac turpis.',
             rule:''
         },
         'omega':{
             input:'70',
             help:'Nullam ullamcorper quam nibh, in tempor ipsum semper vel. Sed lobortis maximus augue in cursus. Aliquam erat volutpat.',
             rule:'^.{5,}'
         },
    },
    selector:function(row){
        for(var i = 0; i < this.types.length; i++){
            if((new RegExp(this.types[i].expression ,'m')).test(row))return this.types[i];
        }

        return null;
    },
    data:{}
};
