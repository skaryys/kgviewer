<template>
  <div :class="[
  'col',
  xs ? 'xs-' + xs : '',
  sm ? 'sm-' + sm : '',
  md ? 'md-' + md : '',
  lg ? 'lg-' + lg : '',
  xl ? 'xl-' + xl : '',
  xxl ? 'xxl-' + xxl : '',
  xsOrder ? 'xs-order' + capitalize(xsOrder) : '',
  smOrder ? 'sm-order' + capitalize(smOrder) : '',
  mdOrder ? 'md-order' + capitalize(mdOrder) : '',
  lgOrder ? 'lg-order' + capitalize(lgOrder) : '',
  xlOrder ? 'xl-order' + capitalize(xlOrder) : '',
  xxlOrder ? 'xxl-order' + capitalize(xxlOrder) : '',
  xsAlign ? 'xs-self' + capitalize(xsAlign) : '',
  smAlign ? 'sm-self' + capitalize(smAlign) : '',
  mdAlign ? 'md-self' + capitalize(mdAlign) : '',
  lgAlign ? 'lg-self' + capitalize(lgAlign) : '',
  xlAlign ? 'xl-self' + capitalize(xlAlign) : '',
  xxlAlign ? 'xxl-self' + capitalize(xxlAlign) : '',
  xsHide ? 'xs-' + xsHide : '',
  smHide ? 'sm-' + smHide : '',
  mdHide ? 'md-' + mdHide : '',
  lgHide ? 'lg-' + lgHide : '',
  xlHide ? 'xl-' + xlHide : '',
  xxlHide ? 'xxl-' + xxlHide : '',
  ]">
    <slot/>
  </div>
</template>

<script>
    const sizesValidator = function (value) {
        let number = parseInt(value);
        if (Number.isInteger(number) || value === "default" || value === "stretch") {
            return true;
        } else {
            return false;
        }
    };

    const ordersValidator = function (value) {
        return ['first', 'last'].indexOf(value) !== -1;
    };

    const alignValidator = function (value) {
        return ['start', 'end', 'center', 'baseline', 'stretch'].indexOf(value) !== -1;
    };

    const hideValidator = function(value) {
        return ['hide', 'show'].indexOf(value) !== -1;
    };

    export default {
        methods: {
            capitalize: function(value) {
                return value.charAt(0).toUpperCase() + value.slice(1);
            }
        },
        props: {
            //sizes
            xs: {
                validator: sizesValidator
            },
            sm: {
                validator: sizesValidator
            },
            md: {
                validator: sizesValidator
            },
            lg: {
                validator: sizesValidator
            },
            xl: {
                validator: sizesValidator
            },
            xxl: {
                validator: sizesValidator
            },
            //orders
            xsOrder: {
                validator: ordersValidator
            },
            smOrder: {
                validator: ordersValidator
            },
            mdOrder: {
                validator: ordersValidator
            },
            lgOrder: {
                validator: ordersValidator
            },
            xlOrder: {
                validator: ordersValidator
            },
            xxlOrder: {
                validator: ordersValidator
            },
            //align
            xsAlign: {
                validator: alignValidator
            },
            smAlign: {
                validator: alignValidator
            },
            mdAlign: {
                validator: alignValidator
            },
            lgAlign: {
                validator: alignValidator
            },
            xlAlign: {
                validator: alignValidator
            },
            xxlAlign: {
                validator: alignValidator
            },
            //hide
            xsHide: {
                validator: hideValidator
            },
            smHide: {
                validator: hideValidator
            },
            mdHide: {
                validator: hideValidator
            },
            lgHide: {
                validator: hideValidator
            },
            xlHide: {
                validator: hideValidator
            },
            xxlHide: {
                validator: hideValidator
            },
        }
    }
</script>

<style scoped lang="scss">
  .col {
    flex: 1 1 0%;
    max-width: 100%;
    padding-left: $columnsSpace / 2;
    padding-right: $columnsSpace / 2;
  }

  //make grid according to breakpoints
  @include colInit($columns, "xs");

  @include break($screen-xs) {
    @include colInit($columns, "sm");
  }

  @include break($screen-sm) {
    @include colInit($columns, "md");
  }

  @include break($screen-md) {
    @include colInit($columns, "lg");
  }

  @include break($screen-lg) {
    @include colInit($columns, "xl");
  }

  @include break($screen-xl) {
    @include colInit($columns, "xxl");
  }
</style>