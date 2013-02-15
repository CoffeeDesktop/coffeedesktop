# => SRC FOLDER
toast 'src/coffeedesktop'

  # EXCLUDED FOLDERS (optional)
  # exclude: ['folder/to/exclude', 'another/folder/to/exclude', ... ]

  # => VENDORS (optional)
  # vendors: ['vendors/x.js', 'vendors/y.js', ... ]

  # => OPTIONS (optional, default values listed)
  # bare: false
  # packaging: true
  # expose: ''
  minify: false

  # => HTTPFOLDER (optional), RELEASE / DEBUG (required)
  httpfolder: 'js'
  release: 'www/js/coffeedesktop.js'
  debug: 'www/js/coffeedesktop-debug.js'


#Sample Application
toast
  folders:
    'src/sa/': 'sa'
    'src/lib': 'lib'

  # EXCLUDED FOLDERS (optional)
  # exclude: ['folder/to/exclude', 'another/folder/to/exclude', ... ]

  # => VENDORS (optional)
  # vendors: ['vendors/x.js', 'vendors/y.js', ... ]

  # => OPTIONS (optional, default values listed)
  # bare: false
  packaging: false
  # expose: ''
  minify: false

  # => HTTPFOLDER (optional), RELEASE / DEBUG (required)
  httpfolder: 'js'
  release: 'www/js/sa.js'
  debug: 'www/js/sa-debug.js'


#Pusher Chat
toast
  folders:
    'src/pch/': 'pch'
    'src/lib': 'lib'

  # EXCLUDED FOLDERS (optional)
  # exclude: ['folder/to/exclude', 'another/folder/to/exclude', ... ]

  # => VENDORS (optional)
  # vendors: ['vendors/x.js', 'vendors/y.js', ... ]

  # => OPTIONS (optional, default values listed)
  # bare: false
  packaging: false
  # expose: ''
  minify: false

  # => HTTPFOLDER (optional), RELEASE / DEBUG (required)
  httpfolder: 'js'
  release: 'www/js/pch.js'
  debug: 'www/js/pch-debug.js'

#IRC gateway
toast
  folders:
    'src/irc/': 'irc'
    'src/lib': 'lib'

  # EXCLUDED FOLDERS (optional)
  # exclude: ['folder/to/exclude', 'another/folder/to/exclude', ... ]

  # => VENDORS (optional)
  # vendors: ['vendors/x.js', 'vendors/y.js', ... ]

  # => OPTIONS (optional, default values listed)
  # bare: false
  packaging: false
  # expose: ''
  minify: false

  # => HTTPFOLDER (optional), RELEASE / DEBUG (required)
  httpfolder: 'js'
  release: 'www/js/irc.js'
  debug: 'www/js/irc-debug.js'