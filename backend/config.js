const accessTokenSecret = 'askdja8y478jsakmsao29ad873hfusfaa';

const config = {
    accessTokenSecret : 'askdja8y478jsakmsao29ad873hfusfaa',
    categoryMaps : {
        'admin.' : 0,
        'blue-collar' : 1,
        'entrepreneur' : 2,
        'housemaid' : 3,
        'management' : 4,
        'retired' : 5,
        'self-employed' : 6,
        'services' : 7,
        'student' : 8,
        'technician' : 9,
        'unemployed' : 10,
        'unknown' : 11,
        'primary' : 0,
        'secondary' : 1,
        'tertiary' : 2,
        'unknown' : 3,
        'may' : 5, 
        'jun' : 6, 
        'jul' : 7, 
        'aug' : 8, 
        'oct' : 10, 
        'nov' : 11, 
        'dec' : 12, 
        'jan' : 1, 
        'feb' : 2, 
        'mar' : 3, 
        'apr' : 4, 
        'sep' : 9
    },
    settings : {
        'age' : {
            'type' : 'int',
            'min' : '18',
            'max' : null
        },
        'job' : {
            'type' : 'category',
            'posibilities' : ['admin.', 'technician', 'services', 'management', 'retired', 'blue-collar', 'unemployed', 'entrepreneur', 'housemaid', 'unknown', 'self-employed', 'student']
        },
        'balance' : {
            'type' : 'int',
            'min' : null,
            'max' : null
        },
        'duration' : {
            'type' : 'int',
            'min' : '0',
            'max' : null
        },
        'education' : {
            'type' : 'category',
            'posibilities' : ['secondary', 'tertiary', 'primary', 'unknown']
        },
        'day' : {
            'type' : 'int',
            'min' : '1',
            'max' : '31'
        },
        'month' : {
            'type' : 'category',
            'posibilities' : ['may', 'jun', 'jul', 'aug', 'oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'sep']
        },
    }
}

module.exports = config;